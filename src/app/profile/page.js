import React from "react";
export default function Profile() {
return (
   <div className="container">
    <div className="row">

      <div className="col-12 my-5 px-4">
        <h2 className="fw-bold">PROFILE</h2>
        <div style={{fontSize:"14px"}}>
          <a href="index.php" className="text-secondary text-decoration-none">HOME</a>
          <span className="text-secondary">  </span>
          <a href="#" className="text-secondary text-decoration-none">PROFILE</a>
        </div>
      </div>

      
      <div className="col-12 mb-5 px-4">
        <div className="bg-white p-3 p-md-4 rounded shadow-sm">
          <form id="info-form">
            <h5 className="mb-3 fw-bold">Basic Information</h5>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Name</label>
                <input name="name" type="text" value="test" className="form-control shadow-none" required/>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Phone Number</label>
                <input name="phonenum" type="number" value="3842398293" maxLength={10} className="form-control shadow-none" required/>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Date of birth</label>
                <input name="dob" type="date" value="1995" className="form-control shadow-none" required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Pincode</label>
                <input name="pincode" type="number" value="394315" className="form-control shadow-none" required />
              </div>
              <div className="col-md-8 mb-4">
                <label className="form-label">Address</label>
                <textarea name="address" className="form-control shadow-none" rows="1" required>surat</textarea>
              </div>
            </div>
            <button type="submit" className="btn text-white custom-bg shadow-none">Save Changes</button>
          </form>
        </div>
      </div>

      <div className="col-md-4 mb-5 px-4">
        <div className="bg-white p-3 p-md-4 rounded shadow-sm">
          <form id="profile-form">
            <h5 className="mb-3 fw-bold">Picture</h5>
            <img src="test1.php" className="rounded-circle img-fluid mb-3" />

            <label className="form-label">New Picture</label>
            <input name="profile" type="file" accept=".jpg, .jpeg, .png, .webp" className="mb-4 form-control shadow-none" required />

            <button type="submit" className="btn text-white custom-bg shadow-none">Save Changes</button>
          </form>
        </div>
      </div>


      <div className="col-md-8 mb-5 px-4">
        <div className="bg-white p-3 p-md-4 rounded shadow-sm">
          <form id="pass-form">
            <h5 className="mb-3 fw-bold">Change Password</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">New Password</label>
                <input name="new_pass" type="password" className="form-control shadow-none" required />
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label">Confirm Password</label>
                <input name="confirm_pass" type="password" className="form-control shadow-none" required />
              </div>
            </div>
            <button type="submit" className="btn text-white custom-bg shadow-none">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  </div>
)
}