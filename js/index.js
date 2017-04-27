/**
 * Created by Administrator on 2017/1/11 0011.
 */
+function(){
    var winW=$(window).width();
    var desW=640;
     htmlFont=winW/desW*100;
    window.htmlFont=htmlFont;
    document.documentElement.style.fontSize=htmlFont+'px';
}();
+function() {
    var $header=$('.header');
    $footer=$('.footer');
    $main=$('.main');
    $winH=$(window).height();
    $main.css('height',$winH-$footer.height()-$header.height()-0.8*htmlFont)
}()
var musicUtils=(function(){
    var $callbacks=$.Callbacks();
    var $lyric=$('.lyric'),
        $audio=$('audio'),
        $btn=$('.btn'),
        $play=$('.play'),
        $pause=$('.pause'),
        $duration=$('.duration'),
        $timeLine=$('.timeLine'),
        $span=$timeLine.find('span'),
        $current=$('.current'),
        $main=$('.main');
    function fm(s){
        var m =Math.floor(s/60);
        var s=Math.floor(s%60);
        m>=0&&m<=10?m='0'+m:null;
        s>=0&&s<=10?s='0'+s:null;

        return m+':'+s;

    }
    $callbacks.add(function(data){
        var str='';
        for(var i=0;i<data.length;i++){
            str+= '<p data-minute="'+data[i].minute+'" data-second="'+data[i].second+'">'+data[i].content+'</p>'
        }
        $lyric.html(str)
    });
    $callbacks.add(function(){
        $pause.show().prev().hide();
        $audio.on('canplay',function(){
            this.play();
            $duration.html(fm(this.duration));
            $btn.on('tap',function(){
                if($audio[0].paused){
                    $audio[0].play();
                    $pause.show().prev().hide()

                }else{
                    $audio[0].pause();
                    $pause.hide().prev().show()
                }
            })
        })
    });
    $callbacks.add(function(){
        var timer=setInterval(function(){
            var current=fm($audio[0].currentTime);

            $current.html(current);
            var m=current.split(':')[0];
            var s=current.split(':')[1];
            $span.css('width',$audio[0].currentTime/$audio[0].duration*100+'%');
            var $tar=$lyric.find('p').filter('[data-minute="'+m+'"]').filter('[data-second="'+s+'"]');
            $tar.addClass('on').siblings('p').removeClass('on');
            var n=$tar.index();
            if($audio[0].ended){
                clearInterval(timer)
            }
            if(n>=3){
                $lyric.css('top',(n-2)*-0.84+'rem')
            }
        },1000);

    })


    return {
        init:function(){
           $.ajax({
               url:'lyric.json',
               type:'GET',
               dataType:'json',
                cache:false,
                  success:function(result){
                      result=result.lyric||'';
                      result=result.replace(/&#(\d+)/g,function($0,$1){
                            var val=$0;
                          switch (Number($1)){
                             case 45:
                                  val='-';
                                  break;
                              case 32:
                                  val='';
                                  break;
                              case 40:
                                  val='(';
                                  break;
                              case 41:
                                  val=')';
                                  break
                          }
                        return val;

                      });
                      var reg=/\[(\d{2})&#58;(\d{2})&#46;(?:\d+)\]([^&#]+)(?:&#\d+;)/g;
                      var aryData=[];
                      result.replace(reg,function(){
                aryData.push({
                    minute:arguments[1],
                    second:arguments[2],
                    content:arguments[3]
                })
                      });
                      $callbacks.fire(aryData)
                  }

           })
        }
    }
})();
musicUtils.init()