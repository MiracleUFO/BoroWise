function calculateNextPaymentDueDate(loanCreationDate: string, installmentType: string) {
  // Convert the loan creation date and current date to the same format.
  const currentDateString = new Date().toISOString();

  // Calculate the number of days since the loan creation date.
  const currentDate = new Date(currentDateString);
  const loanDate = new Date(loanCreationDate);

  let daysSinceLoanCreation = 0;
  if (!Number.isNaN(currentDate.getTime()) && !Number.isNaN(loanDate.getTime())) {
    daysSinceLoanCreation = (currentDate.getTime() - loanDate.getTime()) / (1000 * 60 * 60 * 24);
  }
  // Calculate the next payment installment date based on the installment type.
  const loanCreatedDate = new Date(loanCreationDate);
  let nextDueDate;
  switch (installmentType) {
    case 'quarterly':
      nextDueDate = loanCreatedDate.setMonth(loanCreatedDate.getMonth() + 3);
      break;
    case 'half_year':
      nextDueDate = loanCreatedDate.setMonth(loanCreatedDate.getMonth() + 6);
      break;
    case 'yearly':
      nextDueDate = loanCreatedDate.setFullYear(loanCreatedDate.getFullYear() + 1);
      break;
    default:
      break;
  }

  // Add the number of days since the loan creation date to the next payment installment date.
  nextDueDate = new Date((nextDueDate || 0) + (daysSinceLoanCreation * 24 * 60 * 60 * 1000));

  return nextDueDate;
}

export default calculateNextPaymentDueDate;
