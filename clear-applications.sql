-- Очистить все заявки
DELETE FROM applications;

-- Показать результат
SELECT COUNT(*) as remaining_applications FROM applications;
