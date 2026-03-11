type EqualTypes<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

export const __tsCheckSame = <T1, T1_REPEAT extends T2, T2 extends T1>(
  value: EqualTypes<T1, T2>
) => undefined;
