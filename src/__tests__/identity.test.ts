import { getIdentity } from '../identity';

describe('getIdentity', () => {
  test('pem file path', async () => {
    const identity = await getIdentity({ pemFilePath: './src/__tests__/test.pem' });
    const actual = identity.getPrincipal().toText();
    const expected = 'rj7d3-s2elv-534ku-uw4hv-47mbb-zdxpp-x3d5l-ytbvr-6j5kq-sjsbk-oae';
    expect(actual).toBe(expected);
  });

  test('pem Secp256k1 string', async () => {
    const pem: string = `-----BEGIN EC PRIVATE KEY-----
    MHQCAQEEIO4+Te68VEgVycbzo2i5dKlTfnHCirUlq78RpgkQjC4koAcGBSuBBAAK
    oUQDQgAEdroMVlbxCfmjdJlGtHv/8KwfumgEAAWMgf//hWwd5kGfQ8bNCSi5JCBX
    /EQjurniFRYQNPN2v/68la0T2UlwyA==
    -----END EC PRIVATE KEY-----`;

    const identity = await getIdentity({ pem });
    const actual = identity.getPrincipal().toText();
    const expected = 'w6ca7-7izdo-noze7-jbuqi-hbv6k-cfxtu-3ga2a-ddyhg-eyvaj-xhdol-qqe';
    expect(actual).toBe(expected);
  });

  test('pem Ed25519 string', async () => {
    const pem: string = `-----BEGIN PRIVATE KEY-----
    MFMCAQEwBQYDK2VwBCIEIAphBDQcr/T1VNwK3T99GDZuf3z3ZJBPXpxP0foscUCM
    oSMDIQARxunjiuk4X+yyG0F8jUA7iLzRwdMjBcz3iIWR17BMvQ==
    -----END PRIVATE KEY-----`;

    const identity = await getIdentity({ pem });
    const actual = identity.getPrincipal().toText();
    const expected = 'f5zwa-v7dmo-hvj5t-czvbh-mireu-lrcs5-puub4-yx6s2-osluu-4v4yn-zqe';
    expect(actual).toBe(expected);
  });

  test('seed phrase', async () => {
    const identity = await getIdentity({
      seed: 'control work legal artist base state sample try city pond demise exist',
    });
    const actual = identity.getPrincipal().toText();
    const expected = 'inr3h-wtg34-hgwia-752ch-ldtdo-qdah4-e5xtg-gqg7l-rinjh-ub3rq-4qe';
    expect(actual).toBe(expected);
  });

  test('no key provided', async () => {
    await expect(getIdentity({} as any)).rejects.toThrowError(
      'Must provide a seed phrase or pem to create an identity',
    );
  });
});
