import React from 'react';
//pure function
const Rank = ({name, entries}) => {
  return (
    <div>
      {name}{', your current rank is ...'}{entries}
    </div>
  );
}

export default Rank;