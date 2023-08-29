const calculateCreditScore = (yearlySalary: number, totalAssetsWorth: number) => {
  // Define maximum values for salary and assets
  const maxSalary = 10000000; // 10 million Naira
  const maxAssetsWorth = 1000000; // 10 million Naira

  // Calculate normalized values (between 0 and 1)
  const normalizedSalary = Math.min(yearlySalary / maxSalary, 1);
  const normalizedAssetsWorth = Math.min(totalAssetsWorth / maxAssetsWorth, 1);

  // Weighted factors (adjust these as needed)
  const salaryWeight = 0.7;
  const assetsWeight = 0.3;

  // Calculate the credit score
  const creditScore = (
    normalizedSalary * salaryWeight + normalizedAssetsWorth * assetsWeight
  );

  // Ensure the score is within the 0-100 range
  const finalCreditScore = Math.min(Math.max(creditScore, 0), 100);

  return finalCreditScore * 100;
};

export default calculateCreditScore;
