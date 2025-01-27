const HistoryPage = () => {
  return (
    <div className="container">
      <h1 className="display-6 mb-4">移動履歴</h1>
      <div className="card">
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            2023年5月1日
            <span>5km歩行、500 ETH獲得</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            2023年5月2日
            <span>10km自転車、100 ETH獲得</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            2023年5月3日
            <span>3km歩行、300 ETH獲得</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default HistoryPage

