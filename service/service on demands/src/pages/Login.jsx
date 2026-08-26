const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const data = await apiRequest("/users/login/", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
        });

        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        const user = await apiRequest("/users/me/");
        localStorage.setItem("user", JSON.stringify(user));

        const redirect = sessionStorage.getItem("redirectAfterLogin");

        if (redirect) {
            sessionStorage.removeItem("redirectAfterLogin");
            window.location.href = redirect;
            return;
        }

        if (user.role === "provider") {
            window.location.href = "/dashboard/provider";
        } else if (user.role === "admin") {
            window.location.href = "/dashboard/admin";
        } else {
            window.location.href = "/dashboard/customer";
        }
    } catch (err) {
        console.error(err);

        setError(
            err.detail ||
            err.error ||
            err.message ||
            "Invalid email or password"
        );
    }
};const { login } = useAuth();
placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"placeholder="••••••••"
