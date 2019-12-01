import React, { useContext } from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import ActivityStore from '../../app/stores/activityStore';
import { observer } from "mobx-react-lite";

export const NavBar : React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const  { openCreateForm } = activityStore;

  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
          <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
          Reactivities
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item name="about" >
          <Button onClick={openCreateForm} positive>Create Activity</Button>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
