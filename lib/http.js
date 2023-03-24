const axios = require('axios');

function getRepoList() {
    return axios.get('https://api.github.com/users/muzhe1228/repos')
}

function getTagList(repo) {
    return axios.get(`https://api.github.com/repos/muzhe1228/${repo}/tags`)
}

axios.interceptors.response.use(res=>{
    return res.data;
})

module.exports ={
    getRepoList,
    getTagList
}