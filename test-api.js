// 简单的API测试脚本
const axios = require('axios');

async function testAPI() {
  try {
    console.log('测试API连接...');
    
    // 测试获取项目列表
    const response = await axios.get('http://localhost:3000/api/v1/projects?page=1&size=10');
    console.log('API响应:', response.data);
    
  } catch (error) {
    console.error('API测试失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

testAPI(); 