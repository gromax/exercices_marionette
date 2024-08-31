  class FloatNumber extends SimpleNumber
    _float:false # flag passant à true quand le calcul devient approximatif
    float: (decimals) -> NaN
    approx: (decimals) -> new RealNumber()
