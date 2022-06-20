/** @jsxImportSource @emotion/react */
import { Layout } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import logo from './assets/images/logo.png';
import { Preferences } from './components/Preferences';

const today = new Date();

const App = () => {
  return (
    <Layout css={{ background: '#fff' }}>
      <Header
        css={{ background: '#fff', height: '180px', textAlign: 'center' }}
      >
        <img
          css={{
            width: '150px',
            paddingTop: '30px',
            margin: '0px 20px 0px 20px',
          }}
          src={logo}
          alt="logo"
        />
      </Header>
      <Content css={{ padding: '0 50px', marginTop: 10 }}>
        <Preferences />
      </Content>
      <Footer css={{ textAlign: 'center', background: '#fff' }}>
        Designed by © Hi-PR! {today.getFullYear()}
      </Footer>
    </Layout>
  );
};

export default App;
