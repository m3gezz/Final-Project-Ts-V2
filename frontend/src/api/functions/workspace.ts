import { api } from "../axios";

const getWorkspaces = async (searcher) => {
  const res = await api.get(
    `workspaces?page=${searcher?.pagination?.current_page}&search=${searcher?.search}&status=${searcher?.status}&type=${searcher?.type}`,
  );
  searcher?.setPagination((prev) => ({
    ...prev,
    last_page: res?.data?.last_page,
    to: res?.data?.to,
    total: res?.data?.total,
  }));
  return res?.data?.data;
};

export { getWorkspaces };
