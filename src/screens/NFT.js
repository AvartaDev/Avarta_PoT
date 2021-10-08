import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet
} from 'react-native';
import {BgView} from '@components/Layout';
import useTheme from '@hooks/useTheme';
import GridImageView from 'react-native-grid-image-viewer';
import { result } from 'lodash';

const getImageUrl = async (data) => {
  if(!!data.metadata) {
    if(typeof data.metadata === 'string') {
      return JSON.parse(data.metadata).image;
    }
    return data.metadata.image;
  } else {
    return await fetch(data.uri).then(response => response.json()).then(data => {
      return data.image;
    });
  }
}
const NFT = ({navigation}) => {
  const {colors, gutter} = useTheme();
  const [imageUrls, setImageUrls] = useState([]);
  // const demoNFTs = [
  //   {
  //     contractAddress: "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270",
  //     tokenId: "14000069",
  //   },
  //   {
  //     contractAddress: "0x7581f8e289f00591818f6c467939da7f9ab5a777",
  //     tokenId: "6927",
  //   },
  //   {
  //     contractAddress: "0xb28a4fde7b6c3eb0c914d7b4d3ddb4544c3bcbd6",
  //     tokenId: "3106",
  //   },
  // ];
  useEffect(() => {
    setImageUrls([]);
    // demoNFTs.forEach((nft) => {
    //   fetch(`https://ethereum-azrael.arkane.network/contracts/${nft.contractAddress}/tokens/${nft.tokenId}`)
    //     .then(response => response.json())
    //     .then(async data => {
    //       const url = await getImageUrl(data);
    //       console.log(url);
    //       setImageUrls((imageUrls)=>[...imageUrls, url]);
    //     });
    // })
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("X-API-Key", "p1aDHjAJXxsIWXttnGbulF1pm8ejCpMH2xj7YbPS9dODNt93JUJzihblbAhX5zoP");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch('https://deep-index.moralis.io/api/v2/0xe8afc3937dd7adf295591251807427065f5b285f/nft?chain=eth&format=decimal', requestOptions)
      .then(response => response.json())
      .then(data => {
        data.result.forEach(async nft => {
          const url = await getImageUrl(nft);
          console.log(url);
          setImageUrls((imageUrls)=>[...imageUrls, url]);
        });
      }).catch(error => console.log('error', error));
  }, []);

  return (
    <ImageBackground
      source={require('@assets/images/BG.png')}
      style={{width: '100%', height: '100%'}}>
        <BgView>
          <View style={styles.background}>
          <Text
            style={{
              color: colors.white,
              textAlign: 'center',
              marginTop: gutter.lg,
              fontWeight: 'bold',
              fontSize: 26,
            }}>
            NFT Collection
          </Text>
            <GridImageView data={imageUrls} />
          </View>
        </BgView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {    
    flex: 1
  },
});

export default NFT;
