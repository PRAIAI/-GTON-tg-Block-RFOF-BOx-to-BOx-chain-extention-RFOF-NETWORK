import { Config } from '@ton/blueprint';

export const config: Config = {
    projects: {
        'tgBTC': {
            path: 'contracts/tgBTC.tact',
            output: 'contracts/output',
        }
    }
};
