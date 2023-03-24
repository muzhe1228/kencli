const axios = require('axios');

function getRepoList() {
    return axios.get('https://api.github.com/orgs/FEcourseZone/repos')
}

function getTagList(repo) {
    console.log(repo,'rrrrr')
    return axios.get(`https://api.github.com/repos/FEcourseZone/${repo}/tags`)
}

axios.interceptors.response.use(res=>{
    return res.data;
})

module.exports ={
    getRepoList,
    getTagList
}