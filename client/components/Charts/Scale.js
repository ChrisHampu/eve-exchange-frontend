
export default class Scale {

  timePadding = 60000;

  constructor(scale, domainAccessor, minRangeAccessor, maxRangeAccessor, nice) {

    this.scale = scale();
    this.domainAccessor = domainAccessor;
    this.minRangeAccessor = minRangeAccessor;
    this.maxRangeAccessor = maxRangeAccessor;
    this.nice = nice;

    this.scale.clamp(true);
  }

  setDomainAccessor(newDomainAccessor) {
    this.domainAccessor = newDomainAccessor;
  }

  setNice(newNice) {
    this.nice = newNice;
  }

  update(data) {

    if (!data || !data.length) {
      return;
    }

    if (!this.domainAccessor) {
      return;
    }

    const type = this.domainAccessor(data[0]);

    if (typeof(type) === 'object') {

      const minDate = new Date(Math.min(...data.map(this.domainAccessor)));
      const maxDate = new Date(Math.max(...data.map(this.domainAccessor)));

      minDate.setTime(minDate.getTime() - this.timePadding);
      maxDate.setTime(maxDate.getTime() + this.timePadding);

      this.scale.domain([
        new Date(minDate.getTime()),
        new Date(maxDate.getTime())
      ]);
    } else {
      this.scale.domain([Math.min(...data.map(this.domainAccessor)), Math.max(...data.map(this.domainAccessor))]);
    }

    this.scale.range([this.minRangeAccessor(), this.maxRangeAccessor()]);

    if (this.nice) {
      this.scale.nice(this.nice);
    }

    this.scale.clamp(true);
  }
}
