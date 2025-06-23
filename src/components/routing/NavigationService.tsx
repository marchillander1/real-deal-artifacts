
import { useNavigate } from 'react-router-dom';

export class NavigationService {
  static getAnalysisUrl(consultantId: string): string {
    return `/analysis?id=${consultantId}`;
  }

  static getMyProfileUrl(): string {
    return '/my-profile';
  }

  static getCVUploadUrl(): string {
    return '/cv-upload';
  }

  static getDashboardUrl(): string {
    return '/dashboard';
  }

  static redirectToAnalysis(consultantId: string): void {
    window.location.href = this.getAnalysisUrl(consultantId);
  }

  static redirectToMyProfile(): void {
    window.location.href = this.getMyProfileUrl();
  }

  static redirectToDashboard(): void {
    window.location.href = this.getDashboardUrl();
  }
}

export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    goToAnalysis: (consultantId: string) => navigate(`/analysis?id=${consultantId}`),
    goToMyProfile: () => navigate('/my-profile'),
    goToCVUpload: () => navigate('/cv-upload'),
    goToDashboard: () => navigate('/dashboard'),
  };
};
