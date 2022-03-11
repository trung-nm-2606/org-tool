import React from 'react';

const AllGroups = () => (
  <div className="m-3">
    <div className="container">
      <h3>AllGroups</h3>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
        <div className="col mb-2">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Nhóm Lớp 6 - Buổi Sáng</h5>
              <p className="card-text text-secondary">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/group/dashboard" className="btn btn-outline-primary" style={{ 'font-size': '.875rem' }}>Xem chi tiết</a>
            </div>
          </div>
        </div>
        <div className="col mb-2">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Nhóm Lớp 7 - Buổi Sáng</h5>
              <p className="card-text text-secondary">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/group/dashboard" className="btn btn-outline-primary" style={{ 'font-size': '.875rem' }}>Xem chi tiết</a>
            </div>
          </div>
        </div>
        <div className="col mb-2">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Nhóm Lớp 8 - Buổi Sáng</h5>
              <p className="card-text text-secondary">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/group/dashboard" className="btn btn-outline-primary" style={{ 'font-size': '.875rem' }}>Xem chi tiết</a>
            </div>
          </div>
        </div>
        <div className="col mb-2">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Nhóm Lớp 9 - Buổi Sáng</h5>
              <p className="card-text text-secondary">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/group/dashboard" className="btn btn-outline-primary" style={{ 'font-size': '.875rem' }}>Xem chi tiết</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AllGroups;
