import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";

const FollowRequestsDock = () => {
    const { getMe, handleFollowRequestAction } = useUser();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});

    const fetchRequests = async () => {
        const res = await getMe();
        setRequests(res?.followRequests || []);
    };

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            try {
                if (isMounted) {
                    await fetchRequests();
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        init();

        return () => {
            isMounted = false;
        };
    }, []);

    const onRequestAction = async (username, status) => {
        const key = `${username}-${status}`;
        setActionLoading((prev) => ({ ...prev, [key]: true }));

        try {
            await handleFollowRequestAction(username, status);
            await fetchRequests();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading((prev) => ({ ...prev, [key]: false }));
        }
    };

    return (
        <aside className="followRequestsDock">
            <div className="dockHeader">
                <h4>Follow Requests</h4>
                <span>{requests.length}</span>
            </div>

            {loading && <p>Loading...</p>}
            {!loading && !requests.length && <p>No pending requests</p>}

            {!loading && requests.slice(0, 5).map((user) => {
                const acceptKey = `${user.userName}-accept`;
                const rejectKey = `${user.userName}-reject`;
                const busy = actionLoading[acceptKey] || actionLoading[rejectKey];

                return (
                    <div className="requestItem" key={user._id}>
                        <img src={user.profile_image} alt={user.name} />
                        <div className="infoText">
                            <p>{user.name}</p>
                            <p>@{user.userName}</p>
                        </div>
                        <div className="requestActions">
                            <button
                                type="button"
                                className="requestBtn accept"
                                onClick={() => onRequestAction(user.userName, "accept")}
                                disabled={busy}
                            >
                                {actionLoading[acceptKey] ? "..." : "Accept"}
                            </button>
                            <button
                                type="button"
                                className="requestBtn reject"
                                onClick={() => onRequestAction(user.userName, "reject")}
                                disabled={busy}
                            >
                                {actionLoading[rejectKey] ? "..." : "Reject"}
                            </button>
                        </div>
                    </div>
                );
            })}

            {!loading && requests.length > 5 && <p>{requests.length - 5} more pending requests...</p>}
        </aside>
    );
};

export default FollowRequestsDock;
