
const StatCard = ({ title, value, icon, color }) => {
    return (
        <div
            className="stat-card"
            style={{ borderLeft: `4px solid ${color || "#2563eb"}` }}
        >
            <div className="stat-card-content">
                <div>
                    <p className="stat-card-title">{title}</p>
                    <h2 className="stat-card-value">{value}</h2>
                </div>

                <div className="stat-card-icon">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
