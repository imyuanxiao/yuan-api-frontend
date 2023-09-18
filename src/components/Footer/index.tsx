import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = '元宵出品';

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'IM',
          title: 'IM',
          href: 'https://github.com/imyuanxiao',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/imyuanxiao',
          blankTarget: true,
        },
        {
          key: 'YUAN XIAO',
          title: 'YUAN XIAO',
          href: 'https://github.com/imyuanxiao',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
