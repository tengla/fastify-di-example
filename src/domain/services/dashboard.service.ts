import { inject, Lifecycle, scoped } from "tsyringe";
import { AuthService } from "./auth.service";

@scoped(Lifecycle.ContainerScoped)
export class DashboardService {
  constructor(@inject(AuthService) private authService: AuthService) { }

  async getDashboardData() {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Authentication required');
    }

    const user = this.authService.user;
    console.log('User:', user);
    // Different dashboard data based on user role
    if (this.authService.hasRole('admin')) {
      return {
        metrics: {
          totalUsers: 45,
          activeUsers: 32,
          revenue: '$12,450'
        },
        recentActivities: [
          { type: 'user_signup', user: 'john@example.com', time: '2h ago' },
          { type: 'payment_received', amount: '$199', time: '3h ago' }
        ]
      };
    } else {
      return {
        metrics: {
          tasks: 12,
          completed: 8,
          pending: 4
        },
        recentActivities: [
          { type: 'task_completed', task: 'Upload documents', time: '2h ago' },
          { type: 'comment_added', comment: 'Great job!', time: '3h ago' }
        ]
      };
    }
  }
}
