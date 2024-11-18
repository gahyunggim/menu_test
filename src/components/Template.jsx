import React, { useState } from "react";
import { DesktopOutlined } from "@ant-design/icons";

import { Breadcrumb, Layout, Menu, Tabs, theme } from "antd";
import Item from "../pages/Item";
import Customer from "../pages/Customer";
import Material from "../pages/Material";
import Delivery from "../pages/Delivery";

const { Header, Content, Footer, Sider } = Layout;

const pageComponents = {
  Item,
  Customer,
  Material,
  Delivery,
};

const items = [
  {
    key: "sub2",
    label: "기본 정보",
    icon: <DesktopOutlined />,
    children: [
      { key: "Item_품목 정보", label: "품목 정보" },
      { key: "Customer_거래처 정보", label: "거래처 정보" },
      { key: "Material_원자재 정보", label: "원자재 정보" },
      { key: "Delivery_배송 정보", label: "배송 정보" },
    ],
  },
];

const Template = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [tabs, setTabs] = useState([]);
  const [activeKey, setActiveKey] = useState("");
  const [selectedMenuKey, setSelectedMenuKey] = useState([]);

  const onTabChange = (newKey) => {
    setActiveKey(newKey);

    // 탭 변경 시 메뉴의 selectedKeys 동기화
    const newMenuKey = items
      .flatMap((item) => item.children || [])
      .find((child) => child.key.startsWith(newKey));
    setSelectedMenuKey(newMenuKey ? [newMenuKey.key] : []);
  };

  const menuClick = ({ key, keyPath }) => {
    const [componentName, label] = key.split("_");

    setSelectedMenuKey(keyPath);

    const tab = tabs.find((tab) => tab.key === componentName);
    if (tab) {
      setActiveKey(componentName);
    } else {
      const Component = pageComponents[componentName];

      const newTabs = [
        ...tabs,
        { label, key: componentName, children: <Component /> },
      ];
      setTabs(newTabs);
      setActiveKey(componentName);
    }
  };

  const removeTab = (targetKey) => {
    const targetIndex = tabs.findIndex((pane) => pane.key === targetKey);
    const newPanes = tabs.filter((pane) => pane.key !== targetKey);
    // 현재 활성화된 탭이 삭제된 경우 새로운 활성 탭 결정
    if (newPanes.length) {
      const newActiveKey =
        targetIndex === newPanes.length
          ? newPanes[targetIndex - 1].key
          : newPanes[targetIndex].key;
      setActiveKey(newActiveKey);

      // 메뉴의 selectedKeys 동기화
      const newMenuKey = items
        .flatMap((item) => item.children || [])
        .find((child) => child.key.startsWith(newActiveKey));
      setSelectedMenuKey(newMenuKey ? [newMenuKey.key] : []);
    } else {
      // 모든 탭이 삭제되었을 경우
      setActiveKey("");
      setSelectedMenuKey([]);
    }
    setTabs(newPanes);
  };

  const onTabEdit = (targetKey, action) => {
    if (action === "remove") {
      removeTab(targetKey);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={menuClick}
          selectedKeys={selectedMenuKey}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <Tabs
            hideAdd
            type="editable-card"
            onChange={onTabChange}
            activeKey={activeKey}
            items={tabs}
            onEdit={onTabEdit}
          />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Template;
