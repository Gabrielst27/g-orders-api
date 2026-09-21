import { v4 } from 'uuid';

export type EntityProps = {
  createdAt?: Date;
};

export abstract class Entity<Props extends EntityProps> {
  private readonly _id: string;
  private _props: Props;

  protected constructor(props: Props, id?: string) {
    this._id = id || v4();
    const now = new Date();
    props.createdAt = props.createdAt || now;
    this._props = props;
  }

  protected updateProps(props: Partial<Omit<Props, 'createdAt'>>) {
    this._props = {
      ...this._props,
      ...props,
    };
  }

  toJson(): Required<{ id: string } & Props> {
    return { id: this._id, ...this._props } as Required<
      {
        id: string;
      } & Props
    >;
  }
}
