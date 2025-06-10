export default function Login() {
    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Log In</h1>
                <form>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                    <button type="submit">Log In</button>
                </form>
            </div>
        </div>
    );
}
