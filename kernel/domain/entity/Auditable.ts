export interface AuditableProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export class Auditable {
  constructor(protected props: AuditableProps) {}

  get id(): string {
    return this.props.id;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date {
    return this.props.deletedAt;
  }
}
