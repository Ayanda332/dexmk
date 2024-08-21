import Web3 from 'web3';

export const buyTokens = async ({ web3, tokenSaleContract, amount, account, price, setStatus, setIsLoading }) => {
  if (amount <= 0) {
    setStatus("Amount must be greater than 0");
    return;
  }

  if (!web3 || !tokenSaleContract) {
    setStatus("Web3 or contract not initialized");
    return;
  }

  const totalCost = web3.utils.toWei((amount * price).toString(), 'ether');

  try {
    setStatus("Processing transaction...");
    setIsLoading(true); // Set loading to true when starting the transaction
    await tokenSaleContract.methods.buy(amount).send({
      from: account,
      value: totalCost,
    });
    setStatus("Purchase successful!");
  } catch (error) {
    console.error("Transaction failed:", error);
    let errorMessage = "Purchase failed! Please check the console for more details.";
    if (error.message.includes('insufficient funds')) {
      errorMessage = "Insufficient funds. Please check your balance.";
    }
    setStatus(errorMessage);
  } finally {
    setIsLoading(false); // Set loading to false after the transaction completes
  }
};
