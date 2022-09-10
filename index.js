const axios = require('axios').default;

const args = process.argv.slice(2);
const [githubUser, accessToken] = args;

const githubApi = axios.create({
    baseURL: 'https://api.github.com',
    auth: {
        username: githubUser,
        password: accessToken
    }
})

async function changeRepoToPrivate(repoName) {
    const body = {
        private: true,
    };

    await githubApi.patch(`/repos/${githubUser}/${repoName}`, body);
}

async function getAllRepos() {
    console.log(`Getting ${githubUser}'s repositories`)
    const { data } = await githubApi.get(`/users/${githubUser}/repos?type=owner`);

    console.log(`Returning repositories`)
    return data.map(x => x.name);
}

async function main() {
    try {
        const repos = await getAllRepos();

        console.log(`Requesting visbility change for each ${githubUser}'s public repository`)
        for (const name of repos) {
            changeRepoToPrivate(name);
        }

        console.log('Finish! Changed repo\'s: ', repos)
    } catch (err) {
        console.error('Failed to process');
        console.error(err.message);
    }
}

main();
