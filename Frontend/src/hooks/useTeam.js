import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMember,
  removeMember as removeMemberAction,
  setError,
  setLoaded,
  setLoading,
  setMembers,
  updateMember,
} from "../store/slices/teamSlice";
import { getMembers, updateMemberRole } from "../services/team.api";

const defaultColors = [
  "#00D4FF",
  "#7B61FF",
  "#00FF88",
  "#FFB800",
  "#FF4757",
  "#d1bcff",
  "#3cd7ff",
];

function toInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function toDisplayRole(role) {
  if (role === "admin") return "Admin";
  if (role === "member") return "Member";
  return role || "Member";
}

function normalizeMember(member, index = 0) {
  const name = member.name || member.username || "Unknown User";
  const id = member.id || member._id;

  return {
    id,
    name,
    email: member.email || "",
    role: toDisplayRole(member.role),
    avatar: member.avatar || toInitials(name),
    color: member.color || defaultColors[index % defaultColors.length],
  };
}

export default function useTeam(options = {}) {
  const { autoFetch = false } = options;
  const dispatch = useDispatch();
  const { members, loading, error, loaded } = useSelector(
    (state) => state.team,
  );

  const fetchMembers = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await getMembers();
      const normalized = Array.isArray(data)
        ? data.map((member, index) => normalizeMember(member, index))
        : [];
      dispatch(setMembers(normalized));
      dispatch(setLoaded(true));
      return { ok: true, data: normalized };
    } catch (error) {
      const message = error?.response?.data?.error || "Failed to load team";
      dispatch(setError(message));
      dispatch(setLoaded(true));
      return { ok: false, error: message };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const addLocalMember = useCallback(
    (payload) => {
      dispatch(addMember(payload));
    },
    [dispatch],
  );

  const removeLocalMember = useCallback(
    (memberId) => {
      dispatch(removeMemberAction(memberId));
    },
    [dispatch],
  );

  const updateRole = useCallback(
    async ({ id, role }) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const data = await updateMemberRole(id, role);
        dispatch(updateMember(normalizeMember(data)));
        return { ok: true, data };
      } catch (error) {
        const message = error?.response?.data?.error || "Failed to update role";
        dispatch(setError(message));
        return { ok: false, error: message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (autoFetch && !loaded) {
      fetchMembers();
    }
  }, [autoFetch, loaded, fetchMembers]);

  return {
    members,
    loading,
    error,
    loaded,
    fetchMembers,
    addMember: addLocalMember,
    removeMember: removeLocalMember,
    updateRole,
  };
}
