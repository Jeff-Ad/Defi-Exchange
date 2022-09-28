import { Contract, providers, utils, BigNumber } from "ethers";
import { EXCHANGE_CONTRACT_ABI, EXCHANGE_CONTRACT_ADDRESS } from "../constants";

/**
 * Removes the removeLpTokensWei amount of LP tokens from
 * liquidity and also the calculated vamount of ether and CD tokens
 */

export const removeLiquidity = async (signer, removeLPTokensWei) => {
  // a new instance of the exchange contract

  const exchangeContract = new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    signer
  );
  const tx = await exchangeContract.removeLiquidity(removeLPTokensWei);
  await tx.wait();
};

/**
 * getTokensAfterRemove: Calculates the amount of `Eth` and `CD` tokens
 * that would be returned back to user after he removes `removeLPTokenWei` amount
 * of LP tokens from the contract
 */

export const getTokensAfterRemove = async (
  provider,
  removeLPTokensWei,
  _ethBalance,
  cryptoDevTokenReserve
) => {
  try {
    // a new instance of the exchange contract
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      provider
    );
    // Get the total supply of Crypto Dev LP tokens

    const _totalSupply = await exchangeContract.totalSupply();

    const _removeEther = _ethBalance.mul(removeLPTokensWei).div(_totalSupply);
    const _removeCD = cryptoDevTokenReserve
      .mul(removeLPTokensWei)
      .div(_totalSupply);
    return {
      _removeEther,
      _removeCD,
    };
  } catch (error) {
    console.error(error);
  }
};
