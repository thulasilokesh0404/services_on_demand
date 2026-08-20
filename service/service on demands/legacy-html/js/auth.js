/**
 * Auth JS
 * Handles mock authentication using localStorage
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Check global login state for navbar updates
    updateNavbarState();

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('auth-error');
            
            // Mock authentication
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Success
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirect logic
                const redirect = sessionStorage.getItem('redirectAfterLogin');
                if (redirect) {
                    sessionStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirect;
                } else {
                    if (user.role === 'provider') {
                        window.location.href = 'provider/dashboard.html';
                    } else if (user.role === 'admin') {
                        window.location.href = 'admin/dashboard.html';
                    } else {
                        window.location.href = 'customer/dashboard.html';
                    }
                }
            } else {
                // Failure
                errorDiv.textContent = 'Invalid email or password.';
                errorDiv.style.display = 'block';
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('auth-error');
            
            // Get role from global variable defined in register.html script block
            const role = typeof selectedRole !== 'undefined' ? selectedRole : 'customer';
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.find(u => u.email === email)) {
                errorDiv.textContent = 'An account with this email already exists.';
                errorDiv.style.display = 'block';
                return;
            }
            
            const newUser = {
                id: Date.now(),
                name,
                email,
                password,
                role,
                balance: 1000 // Give some starting mock balance
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Auto login after registration
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            if (role === 'provider') {
                window.location.href = 'provider/dashboard.html';
            } else {
                window.location.href = 'customer/dashboard.html';
            }
        });
    }
});

function updateNavbarState() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const navActions = document.querySelector('.nav-actions');
    
    if (user && navActions) {
        navActions.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span class="font-medium text-primary" style="font-size: 0.875rem;">
                    <i class="fa-solid fa-user"></i> ${user.name}
                </span>
                <a href="${user.role === 'provider' ? 'provider/dashboard.html' : 'customer/dashboard.html'}" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Dashboard</a>
                <button onclick="logout()" class="btn" style="padding: 0.5rem 1rem; font-size: 0.875rem; color: var(--text-muted);"><i class="fa-solid fa-right-from-bracket"></i></button>
            </div>
        `;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
