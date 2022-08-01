import {
  getCommonPlatformData,
  getPlatformsData,
  getUnitCostData,
} from "../../utils/estimationApi";
import { formatPlatformData, formatProjectData } from "../../utils/helpers";
import { projectSuccess } from "../reducers/ProjectSlice";
import {
  platformFailure,
  platformPending,
  platformsSuccess,
  togglePlatformSelectionStatus,
} from "../reducers/UserSLice";

export const getPlatformsAction = () => async (dispatch) => {
  dispatch(platformPending());
  try {
    const res = await getPlatformsData();
    const cost = await getUnitCostData();
    const formattedPlatforms = formatPlatformData(res.platforms);
    dispatch(platformsSuccess({ platforms: formattedPlatforms, cost }));
  } catch (error) {
    dispatch(platformFailure(error));
  }
};

export const togglePlatformSelectionAction = (platformId) => (dispatch) => {
  dispatch(togglePlatformSelectionStatus(platformId));
};

export const getCommonPlatformAction = () => async (dispatch) => {
  try {
    const res = await getCommonPlatformData();
    const payload = formatProjectData("Common Application", undefined, res);
    dispatch(projectSuccess(payload));
  } catch (error) {
    dispatch(platformFailure(error));
  }
};
