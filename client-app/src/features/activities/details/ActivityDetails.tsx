import React from "react";
import { Card, Image, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";

interface IProps {
  activity: IActivity;
  editMode: boolean;
  setEditMode: (isEditMode: boolean) => void;
  setSelectActivity: (activity : IActivity | null) => void;
}

const ActivityDetails: React.FC<IProps> = ({
  activity,
  setEditMode,
  editMode,
  setSelectActivity
}) => {
  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span>{activity.date}</span>
        </Card.Meta>
        <Card.Description>
          {activity.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
          <Button.Group widths={2}>
              <Button onClick={() => setEditMode(true)} basic color='blue' content='Edit' />
              <Button onClick={() => setSelectActivity(null)} basic color='grey' content='Cancel'/>
          </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default ActivityDetails;
