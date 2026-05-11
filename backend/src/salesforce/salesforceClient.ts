import jsforce, { type Connection } from 'jsforce';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { config } from '../config/env';
import { ApiError } from '../utils/ApiError';

let connection: Connection | null = null;
const execFileAsync = promisify(execFile);

type SfOrgDisplayResult = {
  status: number;
  result: {
    accessToken: string;
    instanceUrl: string;
  };
};

async function getAliasConnection(): Promise<Connection> {
  const { authAlias, apiVersion } = config.salesforce;

  const { stdout } = await execFileAsync('sf', [
    'org',
    'display',
    '--json',
    '--verbose',
    '--target-org',
    authAlias
  ]);

  const orgData = JSON.parse(stdout) as SfOrgDisplayResult;

  if (orgData.status !== 0 || !orgData.result?.accessToken || !orgData.result?.instanceUrl) {
    throw new ApiError(500, `Salesforce alias auth failed for ${authAlias}.`);
  }

  return new jsforce.Connection({
    accessToken: orgData.result.accessToken,
    instanceUrl: orgData.result.instanceUrl,
    version: apiVersion
  });
}

export async function getSalesforceConnection(): Promise<Connection> {
  if (connection?.accessToken) {
    return connection;
  }

  const { loginUrl, authAlias, username, password, securityToken, accessToken, instanceUrl, apiVersion } =
    config.salesforce;

  if (authAlias) {
    connection = await getAliasConnection();
    return connection;
  }

  if (accessToken && instanceUrl) {
    connection = new jsforce.Connection({
      accessToken,
      instanceUrl,
      version: apiVersion
    });

    return connection;
  }

  if (!username || !password) {
    throw new ApiError(
      500,
      'Salesforce credentials are missing. Set SALESFORCE_AUTH_ALIAS or backend/.env credentials, or enable USE_MOCK_DATA=true.'
    );
  }

  connection = new jsforce.Connection({
    loginUrl,
    version: apiVersion
  });

  await connection.login(username, `${password}${securityToken}`);

  return connection;
}
