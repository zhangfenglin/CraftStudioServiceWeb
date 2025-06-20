import { Box, Typography, Avatar, Grid, Paper, Button, Stack, Card, CardContent } from '@mui/material';

const stats = [
  { label: '入驻天数', value: 1 },
  { label: '作品数', value: 0 },
  { label: '签约作品数', value: 0 },
  { label: '总字数', value: 0 },
];

const Home = () => {
  return (
    <Box>
      {/* 欢迎语和统计 */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3, background: 'linear-gradient(90deg, #f7f8fa 60%, #e9f1ff 100%)' }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item component="div">
            <Avatar sx={{ width: 64, height: 64, bgcolor: '#e3e6f0' }}> </Avatar>
          </Grid>
          <Grid item xs component="div">
            <Typography variant="h6" fontWeight={700} mb={0.5}>晚上好，2008081129</Typography>
            <Typography color="text.secondary" fontSize={15}>今天是你成为作家的第1天，加油码字吧～</Typography>
          </Grid>
          <Grid item component="div">
            <Stack direction="row" spacing={4}>
              {stats.map((item) => (
                <Box key={item.label} textAlign="center">
                  <Typography variant="h5" fontWeight={700}>{item.value}</Typography>
                  <Typography color="text.secondary" fontSize={14}>{item.label}</Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
      {/* AI助手卡片区 */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={5} component="div">
          <Card sx={{ borderRadius: 3, mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>AI小说助手，创作快人一步</Typography>
              <Typography color="text.secondary" fontSize={14} mb={2}>
                一站式AI小说创作投稿平台：一键续润扩，3分钟成文，现已接入DeepSeek大模型，欢迎体验！
              </Typography>
              <Stack spacing={2}>
                <Button variant="contained" color="primary" sx={{ borderRadius: 2, width: 160 }}>+ 开始创作</Button>
                <Button variant="outlined" color="primary" sx={{ borderRadius: 2, width: 160 }}>自由对话成文</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7} component="div">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} component="div">
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography fontWeight={700} mb={1}>短篇小说</Typography>
                  <Typography color="text.secondary" fontSize={14} mb={2}>5万字以内，情节简单节奏快</Typography>
                  <Button variant="contained" size="small" sx={{ borderRadius: 2 }}>创建短篇</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} component="div">
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography fontWeight={700} mb={1}>长篇小说</Typography>
                  <Typography color="text.secondary" fontSize={14} mb={2}>多章节，情节连贯连载更新</Typography>
                  <Button variant="contained" size="small" sx={{ borderRadius: 2 }}>创建长篇</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} component="div">
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography fontWeight={700} mb={1}>短篇一键成文</Typography>
                  <Typography color="text.secondary" fontSize={14} mb={2}>下文一键续写，情节无忧衔接</Typography>
                  <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>全文生成</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} component="div">
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography fontWeight={700} mb={1}>长篇章节生成</Typography>
                  <Typography color="text.secondary" fontSize={14} mb={2}>AI连载不卡文，就在一念之间</Typography>
                  <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>章节生成</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 