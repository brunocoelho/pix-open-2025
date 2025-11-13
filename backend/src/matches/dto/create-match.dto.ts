export class CreateMatchDto {
  double1?: string;
  double2?: string;
  scoreDouble1?: string;
  scoreDouble2?: string;
  round?: 'R16' | 'R8' | 'SEMI' | 'FINAL';
  position?: number;
}
