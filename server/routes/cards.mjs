import fetch from 'node-fetch';

export default function GetAllCardModels()
{
    return new Promise((resolve, reject) => {
        fetch('https://api.rules.art/graphql', {
        method: 'POST',
        headers: { 
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Connection': 'keep-alive',
            'DNT': '1',
            'Origin': 'https://api.rules.art'
        },
        body: JSON.stringify({ query: `
                query{
                    allCardModels{
                        slug,
                        pictureUrl,
                        artist{
                          displayName
                        },
                        season
                    }
                }` 
            }),
        })
        .then(res => res.json())
        .then(res => {
            const array = res.data.allCardModels;

            // Remove dublet cards with same artist.displayName 
            const uniqueArray = array.filter((item, index) => {
                return array.findIndex(({ artist: { displayName } }) => displayName === item.artist.displayName) === index;
            }).map(item => {
                return {
                    ...item,
                    slug: item.slug.replace('-season-1-common', '')
                }
            });

            resolve(uniqueArray);
        });
    });
}