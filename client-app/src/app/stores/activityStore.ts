import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  @action loadActivities = async () => {
    console.time("loadActivitiesTimer");
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();

      runInAction("loading activities", () => {
        activities.forEach(activity => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingInitial = false;
      });
      console.timeEnd("loadActivitiesTimer");
    }
  };

  @action loadActivity = async (id: string) => {
    console.time("loadActivityTimer");
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);

        runInAction("getting activity", () => {
          this.activity = activity;
        });
      } catch (error) {
        console.log(error);
      } finally {
        runInAction(() => {
          this.loadingInitial = false;
        });
        console.timeEnd("loadActivityTimer");
      }
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    console.time("createActivityTimer");
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction("Creating activity", () => {
        this.activityRegistry.set(activity.id, activity);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.submitting = false;
      });
      console.timeEnd("createActivityTimer");
    }
  };

  @action editActivity = async (activity: IActivity) => {
    console.time("editActivityTimer");
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("Editing activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.submitting = false;
      });
      console.timeEnd("editActivityTimer");
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    console.time("deleteActivityTimer");

    this.submitting = true;
    this.target = event.currentTarget.name;

    try {
      await agent.Activities.delete(id);
      runInAction("Deleting activity", () => {
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.target = "";
        this.submitting = false;
      });
      console.timeEnd("deleteActivityTimer");
    }
  };
}

export default createContext(new ActivityStore());
