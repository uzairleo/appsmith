import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { getSelectedWidget } from "selectors/ui";
// const { pathToRegexp, match, parse, compile } = require("path-to-regexp");
import {
  match_api_path,
  match_datasource_path,
  match_query_path,
  match_builder_path,
} from "constants/routes";
import { MAIN_CONTAINER_WIDGET_ID } from "constants/WidgetConstants";
import { updateRecentEntity } from "actions/globalSearchActions";

const getRecentEntity = (pathName: string) => {
  const builderMatch = match_builder_path(pathName);
  if (builderMatch) return { type: "page", id: builderMatch?.params?.pageId };

  const apiMatch = match_api_path(pathName);
  if (apiMatch) return { type: "action", id: apiMatch?.params?.apiId };

  const queryMatch = match_query_path(pathName);
  if (queryMatch) return { type: "action", id: queryMatch.params?.queryId };

  const datasourceMatch = match_datasource_path(pathName);
  if (datasourceMatch)
    return { type: "page", id: datasourceMatch?.params?.datasourceId };

  return {};
};

const RecentEntities = () => {
  const location = useLocation();
  const selectedWidget = useSelector(getSelectedWidget);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedWidget && selectedWidget !== MAIN_CONTAINER_WIDGET_ID)
      dispatch(updateRecentEntity({ type: "widget", id: selectedWidget }));
  }, [selectedWidget]);

  useEffect(() => {
    const { type, id } = getRecentEntity(location.pathname);
    if (type && id && id.indexOf(":") === -1) {
      dispatch(updateRecentEntity({ type, id }));
    }
  }, [location.pathname]);
  return null;
};

export default RecentEntities;