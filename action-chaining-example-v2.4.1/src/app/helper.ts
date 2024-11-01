import {
  ActionPostResponse,
  createSignMessageText,
  createPostResponse,
  NextActionLink,
} from "@solana/actions";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
} from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");

export const getCompletedAction = (type: string): NextActionLink => {
  return {
    type: "inline",
    action: {
      description: `Action ${type} completed`,
      icon: `https://res.cloudinary.com/dficfjyot/image/upload/fl_preserve_transparency/v1728906065/Screenshot_88_ikqvbu.jpg?_s=public-apps`,
      label: `Action ${type} Label`,
      title: `Action ${type} completed`,
      type: "completed",
    },
  };
};

export async function getTransactionResponse(
  account: string
): Promise<ActionPostResponse> {
  const sender = new PublicKey(account);
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: new PublicKey("HFV94PdaUUS2kkc1cz9MjmUGWEbKPs5LEYksQUFzoe4o"),
      lamports: LAMPORTS_PER_SOL * 0,
    })
  );
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.feePayer = sender;

  const response = createPostResponse({
    fields: {
      type: "transaction",
      links: {
        next: getCompletedAction("transaction"),
      },
      transaction: tx,
    },
  });

  return response;
}

export function getExternalLinkResponse(account: string): ActionPostResponse {
  return {
    type: "external-link",
    externalLink: `https://solscan.io/account/${account}`,
    links: {
      next: getCompletedAction("external-link"),
    },
  };
}

export function getSignMessageResponse(account: string): ActionPostResponse {
  const message = createSignMessageText({
    address: account,
    domain: "https://ngr.appastore.co/",
    issuedAt: "",
    nonce: "10",
    statement: "Nice to have you onboard",
  });

  return {
    type: "message",
    data: message,
    links: {
      // because signature can be spam, it's necessary to validate the signature via a post request
      // this inline type is not supported for this
      next: {
        href: "/api/action/verify",
        type: "post",
      },
    },
  };
}
