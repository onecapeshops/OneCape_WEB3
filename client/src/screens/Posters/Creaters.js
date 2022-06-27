import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { ethers } from 'ethers';
import { apolloClient } from '../../apollo/apolloLens';
import { gql } from '@apollo/client';
import SecondaryLayout from '../../components/SecondaryLayout';
import { PRIMARY } from '../../uicontants';
import { getAddress, signText } from '../../helpers/ethers-service';
import { generateChallenge } from '../../helpers/generate-challenge';
import { authenticate } from '../../helpers/authenticate';
import { useStore } from 'react-redux';

const GET_FOLLOWING = `
  query($request: FollowingRequest!) {
    following(request: $request) { 
                items {
           profile {
              id
              name
              bio
              handle
                            attributes {
                displayType
                traitType
                key
                value
              }
                            followNftAddress
                            metadata
              picture {
                ... on NftImage {
                  contractAddress
                  tokenId
                  uri
                  verified
                }
                ... on MediaSet {
                  original {
                    url
                    width
                    height
                    mimeType
                  }
                  medium {
                    url
                    width
                    height
                    mimeType
                  }
                  small {
                    url
                    width
                    height
                    mimeType
                  }
                }
              }
              coverPicture {
                ... on NftImage {
                  contractAddress
                  tokenId
                  uri
                  verified
                }
                ... on MediaSet {
                  original {
                    url
                    width
                    height
                    mimeType
                  }
                  small {
                    width
                    url
                    height
                    mimeType
                  }
                  medium {
                    url
                    width
                    height
                    mimeType
                  }
                }
              }
              ownedBy
              dispatcher {
                address
                canUseRelay
              }
              stats {
                totalFollowers
                totalFollowing
                totalPosts
                totalComments
                totalMirrors
                totalPublications
                totalCollects
              }
              followModule {
                ... on FeeFollowModuleSettings {
                  type
                  amount {
                    asset {
                      name
                      symbol
                      decimals
                      address
                    }
                    value
                  }
                  recipient
               }
                             ... on ProfileFollowModuleSettings {
                 type
               }
               ... on RevertFollowModuleSettings {
                 type
               }
            }
          }
        }
       pageInfo {
          prev
          next
          totalCount
       }
        }
  }
`;
const GET_PROFILE = `
  query($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
        id
        name
        bio
        attributes {
          displayType
          traitType
          key
          value
        }
        followNftAddress
        metadata
        isDefault
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        handle
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        ownedBy
        dispatcher {
          address
          canUseRelay
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
            type
            amount {
              asset {
                symbol
                name
                decimals
                address
              }
              value
            }
            recipient
          }
          ... on ProfileFollowModuleSettings {
            type
          }
          ... on RevertFollowModuleSettings {
            type
          }
        }
    }
  }
`;

const CREATE_PROFILE = `
mutation($request: CreateProfileRequest!) { 
  createProfile(request: $request) {
    ... on RelayerResult {
      txHash
    }
    ... on RelayError {
      reason
    }
          __typename
  }
}
`;

const CREATE_FOLLOW_TYPED_DATA = `
  mutation($request: FollowRequest!) { 
    createFollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          FollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          datas
        }
      }
    }
 }
`;

const CreaterCard = ({ profile }) => {
  const wallet = localStorage.getItem('wallet');
  const [buttonState, setButtonState] = useState('');

  const followOneCape = async () => {
    console.log('===>');
    if (wallet && wallet == '0x3bb3aa5bc5487c52b88f3eab242bbde227be81aa') {
      // apolloClient.query({
      //     query: gql(GET_FOLLOWING),
      //     variables: {
      //       request: {
      //         address: wallet,
      //         limit: 10
      //       },
      //     },
      //   }).then(async(res)=>{
      //       console.log("is followed",res)
      //   }).catch(ex=>{
      //       console.log("check err",ex)
      //   })
      setButtonState('Loading...');
      setTimeout(() => {
        setButtonState('Followed');
      }, 2000);

      // apolloClient.mutate({
      //     mutation: gql(CREATE_FOLLOW_TYPED_DATA),
      //     variables: {
      //       request: {
      //         follow: [
      //           {
      //             profile: "0x34ef"
      //           }
      //         ]
      //       }
      //     },
      //   }).then(res=>{
      //       console.log("res",res);
      //       setButtonState("Followed")
      //   }).catch(ex=>{
      //       console.log("catch",ex)
      //   })
    }
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '96%',
        margin: 5,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
      }}
    >
      <img
        src={
          profile?.picture?.original?.url ||
          'https://images.unsplash.com/photo-1638913971789-667874197280?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
        }
        width={100}
        height={100}
        style={{
          borderRadius: '100%',
        }}
      />
      <span
        style={{
          fontWeight: 'bold',
          marginTop: 10,
          fontSize: 20,
        }}
      >
        {profile?.handle}
      </span>
      <span>{`${profile?.stats?.totalFollowers || 1} Follower`}</span>

      <span style={{ marginTop: '10px' }}>{'(You are following)'}</span>

      <div
        onClick={() => {
          followOneCape();
        }}
        style={{
          padding: 6,
          marginTop: 10,
          width: '100%',
          borderRadius: 10,
          color: 'white',
          textAlign: 'center',
          backgroundColor: PRIMARY,
        }}
      >
        <p>
          {buttonState
            ? buttonState
            : wallet && wallet == '0x3bb3aa5bc5487c52b88f3eab242bbde227be81aa'
            ? 'View'
            : 'Follow'}
        </p>
      </div>
      <span style={{ marginTop: '10px' }}>{'powered by LENS'}</span>
    </div>
  );
};

const Creaters = props => {
  const [shopProfile, setShopProfile] = useState({});
  const { isAuthenticated, account } = useMoralis();

  useEffect(() => {
    const apicall = async () => {
      const accessTokenLens = await localStorage.getItem('accessTokenLens');
      if ((isAuthenticated || account) && !accessTokenLens) {
        try {
          const address = await getAddress();
          const challengeResponse = await generateChallenge(address);
          if (!window.ethereum) throw new Error('No crypto wallet found. Please install it.');

          await window.ethereum.send('eth_requestAccounts');
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const signature = await signer.signMessage(challengeResponse?.data?.challenge?.text);
          const tokens = await authenticate(address, signature);
          localStorage.setItem('accessTokenLens', tokens?.data?.authenticate?.accessToken);
          localStorage.setItem('refreshTokenLens', tokens?.data?.authenticate?.refreshToken);
        } catch (err) {
          console.log('errr', err);
        }
      }
    };
    apicall();
  }, [isAuthenticated, account]);

  useEffect(() => {
    const apicall = async () => {
      const wallet = await localStorage.getItem('wallet');
      const lensProfile = await localStorage.getItem('lensProfile');

      if (!lensProfile) {
        const accessTokenLens = await localStorage.getItem('accessTokenLens');

        if ((isAuthenticated || account) && accessTokenLens) {
          await apolloClient
            .query({
              query: gql(GET_PROFILE),
              variables: {
                request: { handle: `${wallet.substring(36, wallet.length)}.test` },
              },
            })
            .then(async res => {
              if (res?.data.profile == null) {
                if (wallet && wallet != '0x3bb3aa5bc5487c52b88f3eab242bbde227be81aa') {
                  const createProfile = createProfileRequest => {
                    return apolloClient.mutate({
                      mutation: gql(CREATE_PROFILE),
                      variables: {
                        request: createProfileRequest,
                      },
                    });
                  };

                  await createProfile({
                    handle: wallet.substring(36, wallet.length),
                    profilePictureUri: null,
                    followModule: {
                      freeFollowModule: true,
                    },
                  });
                  await localStorage.setItem(
                    'lensProfile',
                    `${wallet.substring(36, wallet.length)}.test`,
                  );
                }
              }
              // setShopProfile(res?.data);
            })
            .catch(ex => {
              console.log('exxxx', ex);
            });
        }
      }

      if (wallet == '0x3bb3aa5bc5487c52b88f3eab242bbde227be81aa' && !lensProfile) {
        await localStorage.setItem('lensProfile', 'OneCapeTestShop.test');
      }
    };
    apicall();
  }, []);

  useEffect(() => {
    const profile = async () => {
      const accessTokenLens = await localStorage.getItem('accessTokenLens');
      if (accessTokenLens) {
        await apolloClient
          .query({
            query: gql(GET_PROFILE),
            variables: {
              request: { handle: 'OneCapeTestShop.test' },
            },
          })
          .then(res => {
            setShopProfile(res?.data);
          })
          .catch(ex => {
            console.log('exxxx', ex);
          });
      }
    };
    profile();
  }, [isAuthenticated, account, shopProfile, window]);


  return (
    <SecondaryLayout title="Creaters" route={props}>
      <div
        style={{
          display: 'flex',
          flex: 1,
          width: '100%',
          height: '100vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CreaterCard profile={shopProfile?.profile || {}} />
      </div>
    </SecondaryLayout>
  );
};

export default Creaters;
