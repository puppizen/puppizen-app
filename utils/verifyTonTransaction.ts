import TonWeb from 'tonweb';

export interface TonTransaction {
  utime: number;
  transaction_id: {
    lt: string;
    hash: string;
  };
  in_msg?: {
    source?: string;
    destination?: string;
    value?: string;
  };
  description?: {
    exit_code?: number;
  };
}

const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2'));

/**
 * Verifies the most recent TON transaction to a destination address.
 * @param destinationAddress - The receiving wallet address.
 * @param expectedAmountNanoTON - The expected amount in nanoTON (as string).
 * @param approximateTimestamp - Unix timestamp (seconds) when transaction was sent.
 * @returns Sender address and success status.
 */
export async function verifyTonTransaction(
  destinationAddress: string,
  expectedAmountNanoTON: string,
  approximateTimestamp: number
): Promise<{ is_success: boolean; actualSender?: string; transaction?: TonTransaction }> {
  try {
    const address = new TonWeb.utils.Address(destinationAddress);
    const transactions: TonTransaction[] = await tonweb.getTransactions(address, 50);

    const matches = transactions.filter((tx) => {
      const msg = tx.in_msg;
      const valueMatch = BigInt(msg?.value || '0') === BigInt(expectedAmountNanoTON);
      const timeMatch = Math.abs(tx.utime - approximateTimestamp) < 300;
      return valueMatch && timeMatch;
    });

    if (matches.length > 0) {
      const mostRecent = matches.sort(
        (a, b) => Number(BigInt(b.transaction_id.lt) - BigInt(a.transaction_id.lt))
      )[0];

      const actualSender = mostRecent.in_msg?.source;
      const is_success = mostRecent.description?.exit_code === 0 || mostRecent.description?.exit_code === undefined;

      return { is_success, actualSender, transaction: mostRecent };
    }

    return { is_success: false };
  } catch (error) {
    console.error('Verification error:', error);
    return { is_success: false };
  }
}