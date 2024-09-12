use swc_core::ecma::transforms::testing::test;

use super::{get_syntax_config, tr};

test!(
    get_syntax_config(),
    |_| tr(),
    should_do_nothing,
    r#"
    function ComponentA () {}
    const ComponentB = function (){}
    const ComponentC = () => {}
    export const ComponentD = () => {}
    export const ComponentE = () => {}
    export default function ComponentF () {}
    // export default function () {}
    // export default () => {}
    function normal () {}
    const normal2 = function () {}
    "#
);
