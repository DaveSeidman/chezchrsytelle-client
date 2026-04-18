import './index.scss';

type StatusPillProps = {
  children: string;
};

export default function StatusPill({ children }: StatusPillProps) {
  return <span className={`status-pill status-pill--${children.toLowerCase()}`}>{children}</span>;
}
