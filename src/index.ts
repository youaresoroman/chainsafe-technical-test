import minimist from 'minimist';
import { getCid, setCid } from './eth';
import { addToIPFS } from './ipfs';

const help = `
Usage:
help
set --file <file> --privateKey <ethereum account private key>
get
`;


export interface MainProps {
  (args: string[] | undefined, env: { ETH_NETWORK: any; CONTRACT_ADDRESS: any; CONTRACT_ABI: any; IPFS_NETWORK: any; }): Promise<void>;
}

export const main: MainProps = async (_args, env) => {
  
  const { ETH_NETWORK, CONTRACT_ADDRESS, CONTRACT_ABI, IPFS_NETWORK } = env;
  const args = minimist(_args)
  const cmd: string = args._[0];
  const { privateKey, file } = args;
  console.log(privateKey, file)

  if (cmd === "set" && file && privateKey) {
    const cid = await addToIPFS({
      node: IPFS_NETWORK || undefined,
      file
    })

    console.log('cid:', cid)
    console.log('transaction hash:', await setCid({
      provider: ETH_NETWORK,
      privateKey,
      abiFile: CONTRACT_ABI,
      contractAddress: CONTRACT_ADDRESS,
      cid
    }))
  } else if (cmd === "get") {
    console.log('cid:', await getCid({
      provider: ETH_NETWORK,
      abiFile: CONTRACT_ABI,
      contractAddress: CONTRACT_ADDRESS,
    }))
  } else if (cmd === "help") {
    console.log(help);
  } else {
    console.log(help);
  }
  return
}
