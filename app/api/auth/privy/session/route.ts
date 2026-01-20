import { NextResponse } from "next/server"
import { getEthosUserByWalletAddress, ethosUserToApplicationProfile } from "@/lib/ethos"
import { createSession } from "@/lib/session"
import { createApplication, getProjectBySlug, checkExistingApplication } from "@/lib/db"
import { validateCriteria, calculateReapplyDate } from "@/lib/validation"
import { createInviteToken, findValidTokenForApplication } from "@/lib/invite-tokens"

/**
 * Create session from Privy authentication
 * POST /api/auth/privy/session
 *
 * Body: { walletAddress: string, projectSlug: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { walletAddress, projectSlug } = body

    if (!walletAddress || !projectSlug) {
      return NextResponse.json(
        { error: "Missing walletAddress or projectSlug" },
        { status: 400 }
      )
    }

    // Получить Ethos профиль по wallet address
    const ethosUser = await getEthosUserByWalletAddress(walletAddress)

    if (!ethosUser) {
      return NextResponse.json(
        {
          error: "Ethos profile not found",
          message: "Please register at Ethos Network first",
          registration_url: "https://ethos.network"
        },
        { status: 404 }
      )
    }

    // Создать сессию
    await createSession({
      profileId: ethosUser.profileId,
      username: ethosUser.username || `user_${ethosUser.profileId}`,
      accessToken: `privy_${walletAddress}`,
    })

    // Получить проект
    const project = await getProjectBySlug(projectSlug)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Конвертировать в формат для валидации
    const ethosProfile = ethosUserToApplicationProfile(ethosUser)

    // Проверить существующую заявку
    const existingApplication = await checkExistingApplication(
      project.id,
      ethosProfile.profileId
    )

    if (existingApplication) {
      // Если заявка отклонена, проверить cooldown
      if (existingApplication.status === "rejected") {
        const canReapplyTime = existingApplication.can_reapply_at
          ? new Date(existingApplication.can_reapply_at).getTime()
          : 0
        const now = Date.now()

        if (now < canReapplyTime) {
          return NextResponse.json({
            error: "Please wait before reapplying",
            success: false,
            status: "rejected" as const,
            rejection_reason: existingApplication.rejection_reason || "Requirements not met",
            can_reapply_at: new Date(canReapplyTime).toISOString(),
            user_score: ethosProfile.score,
            required_score: project.criteria.minScore,
          }, { status: 429 })
        }

        // Cooldown истек, можно пересоздать заявку
        // Продолжаем валидацию ниже
      } else {
        // Вернуть существующую заявку (accepted или pending)
        const response: {
          success: boolean
          status: "accepted" | "rejected" | "pending"
          user_score: number
          required_score: number
          user_vouches: number
          required_vouches: number
          user_positive_reviews: number
          user_negative_reviews: number
          requires_positive_reviews: boolean
          user_account_age: number
          required_account_age: number
          invite_token?: string
          token_expires_at?: string
          destination_url?: string
          rejection_reason?: string
          failed_criteria?: string[]
          can_reapply_at?: string
        } = {
          success: existingApplication.status === "accepted",
          status: existingApplication.status as "accepted" | "pending",
          user_score: ethosProfile.score,
          required_score: project.criteria.minScore,
          user_vouches: ethosProfile.vouches,
          required_vouches: project.criteria.minVouches,
          user_positive_reviews: ethosProfile.positiveReviews,
          user_negative_reviews: ethosProfile.negativeReviews,
          requires_positive_reviews: project.criteria.positiveReviews,
          user_account_age: ethosProfile.accountAge,
          required_account_age: project.criteria.minAccountAge,
        }

        if (existingApplication.status === "accepted") {
          // Check if valid token already exists
          let tokenData = await findValidTokenForApplication(existingApplication.id)

          // If no valid token, create new one
          if (!tokenData) {
            tokenData = await createInviteToken({
              applicationId: existingApplication.id,
              projectId: project.id,
              ethosProfileId: ethosProfile.profileId,
              destinationUrl: project.destination_url
            })
          }

          response.invite_token = tokenData.token
          response.token_expires_at = tokenData.expiresAt.toISOString()
        }

        return NextResponse.json(response)
      }
    }

    // Валидировать критерии
    const validation = validateCriteria(
      ethosProfile,
      project.criteria,
      project.manual_review
    )

    // Создать заявку
    const application = await createApplication({
      projectId: project.id,
      ethosProfileId: ethosProfile.profileId,
      username: ethosProfile.username || `user_${ethosProfile.profileId}`,
      score: ethosProfile.score,
      status: validation.status,
      rejectionReason: validation.rejectionReason,
      criteriaSnapshot: project.criteria,
      canReapplyAt:
        validation.status === "rejected" ? calculateReapplyDate() : undefined,
    })

    // Вернуть результат
    const response: {
      success: boolean
      status: "accepted" | "rejected" | "pending"
      user_score: number
      required_score: number
      user_vouches: number
      required_vouches: number
      user_positive_reviews: number
      user_negative_reviews: number
      requires_positive_reviews: boolean
      user_account_age: number
      required_account_age: number
      invite_token?: string
      token_expires_at?: string
      destination_url?: string
      rejection_reason?: string
      failed_criteria?: string[]
      can_reapply_at?: string
    } = {
      success: validation.status === "accepted",
      status: application.status as "accepted" | "rejected" | "pending",
      user_score: ethosProfile.score,
      required_score: project.criteria.minScore,
      user_vouches: ethosProfile.vouches,
      required_vouches: project.criteria.minVouches,
      user_positive_reviews: ethosProfile.positiveReviews,
      user_negative_reviews: ethosProfile.negativeReviews,
      requires_positive_reviews: project.criteria.positiveReviews,
      user_account_age: ethosProfile.accountAge,
      required_account_age: project.criteria.minAccountAge,
    }

    if (validation.status === "rejected") {
      response.rejection_reason = validation.rejectionReason
      response.failed_criteria = validation.failedCriteria
      if (application.can_reapply_at) {
        response.can_reapply_at = new Date(application.can_reapply_at).toISOString()
      }
    }

    if (validation.status === "accepted") {
      // Create invite token for new application
      const tokenData = await createInviteToken({
        applicationId: application.id,
        projectId: project.id,
        ethosProfileId: ethosProfile.profileId,
        destinationUrl: project.destination_url
      })

      response.invite_token = tokenData.token
      response.token_expires_at = tokenData.expiresAt.toISOString()
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error("Error creating Privy session:", error)
    return NextResponse.json(
      {
        error: "Authentication failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}