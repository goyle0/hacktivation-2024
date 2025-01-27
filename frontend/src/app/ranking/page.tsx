const RankingPage = () => {
  return (
    <div className="container">
      <h1 className="display-6 mb-4">デイリーランキング</h1>
      <div className="card">
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            1. ユーザー1
            <span className="badge bg-primary rounded-pill">1000 ポイント</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            2. ユーザー2
            <span className="badge bg-primary rounded-pill">900 ポイント</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            3. ユーザー3
            <span className="badge bg-primary rounded-pill">800 ポイント</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default RankingPage

