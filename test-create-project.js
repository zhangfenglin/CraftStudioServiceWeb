// 测试创建项目接口
import axios from 'axios';

async function testCreateProject() {
  const baseURL = 'http://localhost:8080/api/v1';
  const projectData = {
    name: '测试项目',
    desc: '这是一个测试项目'
  };

  try {
    console.log('=== 测试创建项目接口 ===');
    console.log('BaseURL:', baseURL);
    console.log('请求数据:', projectData);
    console.log('完整URL:', `${baseURL}/projects`);
    
    const response = await axios.post(`${baseURL}/projects`, projectData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ 请求成功');
    console.log('响应状态:', response.status);
    console.log('响应数据:', response.data);
    
  } catch (error) {
    console.log('❌ 请求失败');
    console.error('错误信息:', error.message);
    
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else if (error.request) {
      console.error('网络错误 - 无法连接到服务器');
      console.error('请确认后端服务是否在 http://localhost:8080 运行');
    }
  }
}

async function testGetProjects() {
  const baseURL = 'http://localhost:8080/api/v1';
  
  try {
    console.log('\n=== 测试获取项目列表接口 ===');
    console.log('完整URL:', `${baseURL}/projects?page=1&size=10`);
    
    const response = await axios.get(`${baseURL}/projects?page=1&size=10`, {
      timeout: 10000
    });
    
    console.log('✅ 请求成功');
    console.log('响应状态:', response.status);
    console.log('响应数据:', response.data);
    
  } catch (error) {
    console.log('❌ 请求失败');
    console.error('错误信息:', error.message);
    
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

// 运行测试
async function runTests() {
  await testGetProjects();
  await testCreateProject();
}

runTests(); 