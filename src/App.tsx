/** @jsxImportSource @emotion/react */
import { Layout } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import { Route, Routes } from 'react-router-dom';
import logo from './assets/images/logo.png';
import Configuration from './components/Configuration';
import Main from './components/Main';

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
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/configuration" element={<Configuration />}>
            <Route path=":identifier" element={<Configuration />} />
          </Route>
        </Routes>
      </Content>
      <Footer css={{ textAlign: 'center', background: '#fff' }}>
        Designed by © Hi-PR! {today.getFullYear()}
      </Footer>
    </Layout>
  );
};

export default App;
