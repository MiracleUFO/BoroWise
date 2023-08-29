function calculateInstallmentPayment(
  principal: number,
  interestRate: number,
  loanDuration: number,
  installmentType: string,
) {
  // Convert the interest rate from a percentage to a decimal.
  const interest = interestRate / 100;

  // Calculate the number of months in the loan.
  const numberOfMonths = 12 / (installmentType === 'quarterly' ? 4 : 2);

  // Calculate the monthly payment using the following formula:
  // EMI = P x r x (1 + r)^n / [(1 + r)^n - 1]
  const installmentPayment = (
    // eslint-disable-next-line max-len
    (principal * interest * (1 + interest) ** numberOfMonths) / (((1 + interest) ** numberOfMonths) - 1)
  );
  return installmentPayment.toFixed(3);
}

export default calculateInstallmentPayment;
